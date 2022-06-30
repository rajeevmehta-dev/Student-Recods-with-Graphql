import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateStudentInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  dob: string;
}
