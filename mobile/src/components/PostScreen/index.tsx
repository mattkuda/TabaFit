import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PostScreenRouteProp } from '../../navigation/navigationTypes';

export const PostScreen = (): JSX.Element => {
    // const [post, setPost] = useState(null);
    const comments = [{ id: 'Comment 1' }, { id: 'Comment 2' }];
    const route = useRoute<PostScreenRouteProp>();
    const { postId } = route.params;

    return (
        <ScrollView>
            <View>
                <Text>Post</Text>
                <Text>{postId}</Text>
                {postId && (
                    <View>
                        <Text>Content</Text>
                    </View>
                )}
                {/* Render comments */}
                {comments.map((comment) => (
                    <View key={comment.id}>
                        <Text>
                            Todo:
                            {' '}
                            {comment.id}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
