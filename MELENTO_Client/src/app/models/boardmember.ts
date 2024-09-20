export class Boardmember {
  name: string;
  profileImagePath: string;
  title: string;
  introMessage: string;
  constructor(
    name: string,
    profileImagePath: string,
    title: string,
    introMessage: string
  ) {
    this.name = name;
    this.profileImagePath = profileImagePath;
    this.title = title;
    this.introMessage = introMessage;
  }
}
