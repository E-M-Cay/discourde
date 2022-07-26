import { CustomImageMess } from '../CustomLi/CustomLi';

interface Message {
    id: number;
    content: string;
    send_time: string;
    author: any;
}

export const MessageItem = (props: { obj: Message }) => {
    const { obj } = props;
    return (
        <div className='messageItem'>
            <div className='messageItemAvatar'>
                <CustomImageMess
                    obj={
                        'https://robohash.org/sapienteateveniet.png?size=50x50&set=set1'
                    }
                />
            </div>
            <div className='messageItemContent'>
                <div className='messageItemContentName'>
                    {obj.author}
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
