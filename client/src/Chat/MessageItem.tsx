import { CustomImageMess } from "../CustomLi/CustomLi"

export const MessageItem = (props: any) => {
    return (
        <div className='messageItem'>
            <div className='messageItemAvatar'>
                <CustomImageMess  obj={"https://robohash.org/sapienteateveniet.png?size=50x50&set=set1"} />
            </div>
            <div className='messageItemContent'>
                <div className='messageItemContentName'>
                    {props.author}
                    
                    <span className="time">  {props.send_time}</span>
                </div>
                <div className='messageItemContentText'>
                    {props.content}
                </div>
            </div>
        </div>
    )
}