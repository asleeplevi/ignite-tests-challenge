import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should not be able to create a new user if password is not provided", async () => {
    const user = {
      name: "user test",
      email: "test@email.com",
    };
    await expect(
      createUserUseCase.execute(user as User)
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "password",
    };

    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty("id");
  });
});
