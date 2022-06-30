import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentInput } from "./dto/create-student.input";
import { UpdateStudentInput } from "./dto/update-student.input";
import { Student } from "./entities/student.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  /**
   * Create record of a student
   * @returns [student]
   */
  findAllStudents = async (): Promise<Student[]> => {
    return await this.studentRepository.find();
  };

  /**
   * Create record of a student
   * @param id
   * @returns student
   */
  findStudentById = async (id: string): Promise<Student | undefined> => {
    return await this.studentRepository.findOneBy({ id: id });
  };

  /**
   * Create record of a student
   * @param createStudentInput
   * @returns
   */
  createStudent = async (
    createStudentInput: CreateStudentInput,
  ): Promise<Student> => {
    const studentRecord = await this.studentRepository.create(
      createStudentInput,
    );
    const studentRecordDummy = { ...studentRecord };
    studentRecordDummy['age'] = this.getStudentAge(studentRecordDummy.dob);
    return this.studentRepository.save(studentRecordDummy);
  };

  /**
   * Update record of a student
   * @param (id,createStudentInput)
   * @returns student
   */
  updateStudentRecord = (
    id: string,
    updateStudentInput: UpdateStudentInput,
  ) => {
    const studentRecord = this.studentRepository.create(updateStudentInput);
    const studentRecordDummy = { ...studentRecord };
    studentRecordDummy.id = id;
    studentRecordDummy['age'] = this.getStudentAge(studentRecordDummy.dob);
    return this.studentRepository.save(studentRecordDummy);
  };

  /**
   * Remove a student's record
   * @param id
   * @returns void
   */
  removeStudentRecord = async (id: string): Promise<Student> => {
    const findRecord = this.findStudentById(id);
    if (findRecord) {
      const reflectObject = await this.studentRepository.delete(id);
      if (reflectObject.affected === 1) {
        return findRecord;
      }
    }
    throw new NotFoundException(`Record cannot find by id ${id}`);
  };

  /**
   * Find the age from current dob
   * @param dob
   * @returns void
   */
  getStudentAge = (dob: string): number => {
    const ageDifMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
}
