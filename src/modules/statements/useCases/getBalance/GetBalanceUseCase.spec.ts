import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should not be able to get balance if users not exist", () => {
    expect(getBalanceUseCase.execute({ user_id: "123" })).rejects.toEqual(
      new GetBalanceError()
    );
  });

  it("should be able to get account balance", async () => {
    const user = await usersRepository.create({
      name: "test",
      email: "test@email.com",
      password: "123",
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });
    expect(response).toHaveProperty("statement");
    expect(response).toHaveProperty("balance");
  });
});
