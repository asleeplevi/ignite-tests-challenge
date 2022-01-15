import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should not be able to get statement if user not exist", () => {
    expect(
      getStatementOperationUseCase.execute({
        user_id: "123",
        statement_id: "213",
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to get statement if statement id not exist", async () => {
    const user = await usersRepository.create({
      name: "username",
      email: "test@email.com",
      password: "123213",
    });
    expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "213",
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

  it("should be able to get statement", async () => {
    const user = await usersRepository.create({
      name: "username",
      email: "test@email.com",
      password: "123213",
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 20,
      description: "test",
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(response).toEqual(statement);
  });
});
