export class Boardmember {
  id: number;
  name: string;
  profileImagePath: string;
  title: string;
  introMessage: string;
  constructor(
    id: number,
    name: string,
    profileImagePath: string,
    title: string,
    introMessage: string
  ) {
    this.id = id;
    this.name = name;
    this.profileImagePath = profileImagePath;
    this.title = title;
    this.introMessage = introMessage;
  }
}
