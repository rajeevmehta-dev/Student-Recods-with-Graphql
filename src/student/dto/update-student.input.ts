import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateStudentInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  dob: string;
}
