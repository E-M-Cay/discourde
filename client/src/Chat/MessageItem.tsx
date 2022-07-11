import { CustomImageMess } from "../CustomLi/CustomLi"

export const MessageItem = (props: any) => {
    return (
        <div className='messageItem'>
            <div className='messageItemAvatar'>
                <CustomImageMess  obj={props.obj} />
            </div>
            <div className='messageItemContent'>
                <div className='messageItemContentName'>
                    {props.obj.first_name}
                    
                    <span className="time">  {props.obj.time}</span>
                </div>
                <div className='messageItemContentText'>
                    {props.obj.message}
                </div>
            </div>
        </div>
    )
}