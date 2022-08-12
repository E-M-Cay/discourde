import { CustomImageMess } from '../CustomLi/CustomLi';

interface Message {
    id: number;
    content: string;
    send_time: string;
    author: any;
}

interface ServerUser {
    id: number;
    nickname: string;
    user: User;
}

interface User {
    id: number;
    status: number;
    username: string;
}

type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;

export const MessageItem = (props: {
    obj: Message;
    userMap: UserMap;
    picture?: string;
}) => {
    const { obj, userMap, picture } = props;
    return (
        <div className='messageItem'>
            <div className='messageItemAvatar'>
                {userMap.get(obj.author) && (
                    <CustomImageMess
                        user={userMap.get(obj.author)?.user as User}
                    />
                )}
            </div>
            <div className='messageItemContent'>
                <div className='messageItemContentName'>
                    {' '}
                    {userMap.get(obj.author)?.nickname}
                    <span className='time'> {obj.send_time}</span>
                </div>
                <div
                    className='messageItemContentText'
                    style={{ maxWidth: '100%', wordBreak: 'break-word' }}>
                    {obj.content}
                </div>
            </div>
        </div>
    );
};
