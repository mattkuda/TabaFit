export interface Exercise {
    _id: string;
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    videoLink: string;
}
