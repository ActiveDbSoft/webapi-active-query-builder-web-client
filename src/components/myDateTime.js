import DateTime from 'react-datetime';

export default class MyDateTime extends DateTime {
    constructor(props) {
        super(props);
        this.onInputKey = (e) => {
            if ( e.which === 13 )
                this.closeCalendar();
            super.onInputKey(e);
        }
    }
}