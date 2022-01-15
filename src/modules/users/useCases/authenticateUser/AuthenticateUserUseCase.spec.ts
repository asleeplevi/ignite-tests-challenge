import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should not be able to create a new session if user doesn't exists", async () => {
    const user = {
      email: "user@fake.com",
      password: "1234",
    };
    await expect(authenticateUserUseCase.execute(user)).rejects.toEqual(
      new IncorrectEmailOrPasswordError()
    );
  });

  it("should not be able to create a new session if password is incorrect", async () => {
    const user = {
      email: "user@fake.com",
      password: "1234",
    };
    usersRepository.create({
      ...user,
      name: "test",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "4321",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should be able to create a new user", async () => {
    const passwordHash = await hash("123", 8);
    const user = {
      email: "user@fake.com",
      password: passwordHash,
    };
    usersRepository.create({
      ...user,
      name: "test",
    });

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: "123",
    });

    expect(response).toHaveProperty("user");
    expect(response).toHaveProperty("token");
  });
});
