export interface Exercise {
    _id: string;
    name: string;
    description: string;
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    videoLink: string;
}
