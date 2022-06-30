import { Args,Mutation, Query, Resolver,ResolveField, Parent } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  /**
   * This query is used to get all students data.
   * Query [getAllStudent]
   * @returns [Student]
   */
  @Query(() => [Student], { name: 'getAllStudents' })
  findAll() {
    return this.studentService.findAllStudents();
  }

  /**
   * This query is used to get data of particular student.
   * Query [getStudentById]
   * @returns Student
   */
  @Query(() => Student, { name: 'getStudentById' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.studentService.findStudentById(id);
  }

  /**
   * This mutation is used to create a student record.
   * Query [createStudent({name, email, dob})]
   * @returns Student
   */
  @Mutation(() => Student)
  createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    return this.studentService.createStudent(createStudentInput);
  }

  /**
   * This mutation is used to update a student record.
   * Query [updateStudent({id, name, email, dob})]
   * @returns Student
   */
  @Mutation(() => Student)
  updateStudent(
    @Args('updateStudentInput') updateStudentInput: UpdateStudentInput,
  ) {
    return this.studentService.updateStudentRecord(
      updateStudentInput.id,
      updateStudentInput,
    );
  }

  /**
   * This mutation is used to remove a student record.
   * Query [removeStudent(id)]
   * @returns Student
   */
  @Mutation(() => Student, { nullable: true })
  removeStudent(@Args('id', { type: () => String }) id: string) {
    this.studentService.removeStudentRecord(id);
  }
  @ResolveField('age', () => Number)
  age(@Parent() student: Student) {
    const { dob } = student;
    return this.studentService.getStudentAge(dob);
  }
}
