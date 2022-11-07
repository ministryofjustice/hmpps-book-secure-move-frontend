import { Gender } from "./gender";

export interface Person {
  id?: string;
  gender?: Gender;
  _fullname?: string;
  _image_url?: string;
  date_of_birth?: string;
  prison_number?: string;
  police_national_computer?: string;
}
