import { Ability } from '../../ability/model/ability';
import { User } from '../../../authorization/models/user';
import { Lesson } from '../../lessons/model/lesson';

export interface Course {
    id: number;
    title: string;
    description: string;
    courseStart: string;
    courseEnd: string;
    lessonsForPassed: number;
    maximumStudents: number;
    ability: Ability;
    teacher: User;
    students: User[];
    abstractLessons: {
        id: number,
        dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
        lessonStart: string,
        lessonEnd: string,
        lessons: Lesson[]
    }[]
}