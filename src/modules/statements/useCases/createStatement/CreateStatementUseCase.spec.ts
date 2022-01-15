import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should not be able to create statement if user not exists", () => {
    const statement: ICreateStatementDTO = {
      type: "withdraw" as OperationType,
      amount: 10,
      user_id: "123",
      description: "123",
    };
    expect(createStatementUseCase.execute(statement)).rejects.toEqual(
      new CreateStatementError.UserNotFound()
    );
  });

  it("should return an error if balance is less than amount", async () => {
    const user = await usersRepository.create({
      name: "false name",
      email: "user@test.com",
      password: "3214",
    });

    await statementsRepository.create({
      amount: 20,
      description: "123",
      user_id: user.id as string,
      type: "deposit" as OperationType,
    });

    const statement: ICreateStatementDTO = {
      type: "withdraw" as OperationType,
      amount: 21,
      user_id: user.id as string,
      description: "123",
    };

    expect(createStatementUseCase.execute(statement)).rejects.toEqual(
      new CreateStatementError.InsufficientFunds()
    );
  });

  it("should be able to realize withdraw operation", async () => {
    const user = await usersRepository.create({
      name: "false name",
      email: "user@test.com",
      password: "3214",
    });

    await statementsRepository.create({
      amount: 20,
      description: "123",
      user_id: user.id as string,
      type: "deposit" as OperationType,
    });

    const statement: ICreateStatementDTO = {
      type: "withdraw" as OperationType,
      amount: 20,
      user_id: user.id as string,
      description: "123",
    };

    const response = await createStatementUseCase.execute(statement);

    expect(response).toHaveProperty("id");
    expect(response.type).toEqual("withdraw");
    expect(response.amount).toEqual(20);
  });

  it("should be able to realize deposit operation", async () => {
    const user = await usersRepository.create({
      name: "false name",
      email: "user@test.com",
      password: "3214",
    });

    await statementsRepository.create({
      amount: 20,
      description: "123",
      user_id: user.id as string,
      type: "deposit" as OperationType,
    });

    const statement: ICreateStatementDTO = {
      type: "deposit" as OperationType,
      amount: 20,
      user_id: user.id as string,
      description: "123",
    };

    const response = await createStatementUseCase.execute(statement);

    expect(response).toHaveProperty("id");
    expect(response.type).toEqual("deposit");
    expect(response.amount).toEqual(20);
  });
});
