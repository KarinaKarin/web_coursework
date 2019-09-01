import { Lesson } from '../../lessons/model/lesson';
import { User } from '../../../authorization/models/user';

export interface Rating {
    rating: number;
    lesson: Lesson;
    student: User;
}