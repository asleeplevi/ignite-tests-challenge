import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository = new InMemoryUsersRepository();
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });
  it("should not be able to return profile if user doesn't exists", () => {
    const user_id = "213";
    expect(showUserProfileUseCase.execute(user_id)).rejects.toEqual(
      new ShowUserProfileError()
    );
  });

  it("should be able to list user profile", async () => {
    const user = await usersRepository.create({
      name: "user name",
      email: "user@email.com",
      password: "1123",
    });

    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response).toEqual(user);
  });
});
