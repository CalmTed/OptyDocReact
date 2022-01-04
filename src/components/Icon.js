import React from 'react'
const iconData = {
    'undo':'<svg width="17" height="17" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="maincolor-fill" d="M-1.96701e-07 4.5L6 0.602886L6 8.39711L-1.96701e-07 4.5Z" fill="#3C3C3C"/><path  class="maincolor-stroke" d="M4.5 4.5C15.5 4.49999 15.5 4.49999 15.5 14.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="square"/></svg>',
    'redo':'<svg width="17" height="17" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="maincolor-fill" d="M17.5 4.5L11.5 0.602886L11.5 8.39711L17.5 4.5Z" fill="#3C3C3C"/><path class="maincolor-stroke" d="M13 4.5C2 4.49999 2 4.49999 2 14.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="square"/></svg>',
    'newBlock':'<svg width="17" height="17" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="maincolor-stroke" d="M19 4.5H2V17H15V0.5" stroke="#3C3C3C" stroke-width="3"/><path class="background-stroke" d="M20 9H10.5V0" stroke="white"/></svg>',
    'settings':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-fill" fill-rule="evenodd" clip-rule="evenodd" d="M7.17077 5.12257L2.76838 4.02778C1.42427 5.52695 0.453295 7.36269 0 9.3916L2.93568 12.4L0.160563 15.2439C0.745584 17.3158 1.87717 19.1612 3.39133 20.6173L7.17077 19.6774L8.26354 23.4762C9.3848 23.8168 10.5753 24 11.809 24C12.7276 24 13.6222 23.8984 14.4821 23.706L15.641 19.6774L20.0585 20.776C21.5001 19.4417 22.6125 17.762 23.2619 15.8697L19.876 12.4L23.4517 8.73576C22.9282 6.8941 21.9726 5.23213 20.7005 3.86437L15.641 5.12257L14.237 0.241823C13.4526 0.0832554 12.6406 0 11.809 0C10.6671 0 9.56206 0.157003 8.51476 0.450439L7.17077 5.12257ZM11.7835 16C13.9926 16 15.7835 14.2091 15.7835 12C15.7835 9.79086 13.9926 8 11.7835 8C9.57433 8 7.78347 9.79086 7.78347 12C7.78347 14.2091 9.57433 16 11.7835 16Z" fill="#3C3C3C"/> </svg>',
    
    'newTemplate':'<svg width="18" height="18" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-stroke" d="M1.5 1.5H12.5L16.5 4.5V18.5H1.5V1.5Z" stroke="#3C3C3C" stroke-width="3"/> <path class="maincolor-stroke" d="M9 14V6" stroke="#3C3C3C" stroke-width="3"/> <path class="maincolor-stroke" d="M5 10L13 10" stroke="#3C3C3C" stroke-width="3"/> </svg>',
    'exportTemplate':'<svg width="18" height="18" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-fill" d="M19 7.5L15.25 10.5311L15.25 4.46891L19 7.5Z" fill="#3C3C3C"/> <line class="maincolor-stroke" x1="6" y1="7.5" x2="16" y2="7.5" stroke="#3C3C3C" stroke-width="3"/> <path class="maincolor-stroke" d="M13 1.5H1.5V13.5H13" stroke="#3C3C3C" stroke-width="3"/> </svg>',
    'importTemplate':'<svg width="18" height="18" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-fill" d="M13.5 7.5L9.75 10.5311L9.75 4.46891L13.5 7.5Z" fill="#3C3C3C"/> <line class="maincolor-stroke" x1="0.5" y1="7.5" x2="10.5" y2="7.5" stroke="#3C3C3C" stroke-width="3"/> <path class="maincolor-stroke" d="M6.5 1.5H18V13.5H6.5" stroke="#3C3C3C" stroke-width="3"/> </svg>',
    
    'alert':'<svg width="38" height="37" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-stroke" d="M19.4301 3.6663L32.3735 25.495C32.5711 25.8283 32.3309 26.25 31.9434 26.25H6.05659C5.6691 26.25 5.42888 25.8283 5.62651 25.495L18.5699 3.6663C18.7636 3.33966 19.2364 3.33966 19.4301 3.6663Z" fill="#FFF500" stroke="black" stroke-width="3"/> <path class="maincolor-fill" d="M18.2617 19.6777L17.6201 13.1387V10.1152H20.292V13.1387L19.6592 19.6777H18.2617ZM17.7256 23V20.5303H20.1953V23H17.7256Z" fill="black"/> </svg>',
    'ellipse':'<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><circle class="maincolor-fill" cx="5" cy="5" r="5" fill="#B6B6B6"/></svg>',

    'calendar':'<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect class="maincolor-stroke" x="1" y="1" width="15" height="15" rx="1" stroke="#3C3C3C" stroke-width="2" stroke-linejoin="round"/> <path class="maincolor-fill" d="M9.42188 13H8.32422V8.86328C7.92318 9.23828 7.45052 9.51562 6.90625 9.69531V8.69922C7.19271 8.60547 7.50391 8.42839 7.83984 8.16797C8.17578 7.90495 8.40625 7.59896 8.53125 7.25H9.42188V13Z" fill="#3C3C3C"/> <circle class="maincolor-fill" cx="5" cy="4" r="1" fill="#3C3C3C"/> <circle class="maincolor-fill" cx="12" cy="4" r="1" fill="#3C3C3C"/> </svg>',
    'download':'<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-stroke" d="M0.5 14.5H16.5" stroke="#3C3C3C" stroke-width="2"/> <path class="maincolor-stroke" d="M8.5 14.5V0.5" stroke="#3C3C3C" stroke-width="2"/> <path class="maincolor-stroke" d="M8.5 13.5L3.5 9.5" stroke="#3C3C3C" stroke-width="2"/> <path class="maincolor-stroke" d="M8.5 13.5L13.5 9.5" stroke="#3C3C3C" stroke-width="2"/> </svg>',
    'marginOne':'<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-stroke" d="M13.5 2C13.5 11.5 11.5 13.5 2 13.5C11.5 13.5 13.5 15.5 13.5 25C13.5 15.5 15.5 13.5 25 13.5C15.5 13.5 13.5 11.5 13.5 2Z" stroke="#3C3C3C" stroke-width="3" stroke-linejoin="round"/> </svg>',
    'marginTwo':'<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"> <line class="maincolor-stroke" x1="1.5" y1="11.5" x2="21.5" y2="11.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="round"/> <line class="maincolor-stroke" x1="11.5" y1="1.5" x2="11.5" y2="21.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="round"/> </svg>',
    'marginFour':'<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"> <line class="maincolor-stroke" x1="17.5" y1="11.5" x2="21.5" y2="11.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="round"/> <line class="maincolor-stroke" x1="1.5" y1="11.5" x2="5.5" y2="11.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="round"/> <line class="maincolor-stroke" x1="11.5" y1="17.5" x2="11.5" y2="21.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="round"/> <line class="maincolor-stroke" x1="11.5" y1="1.5" x2="11.5" y2="5.5" stroke="#3C3C3C" stroke-width="3" stroke-linecap="round"/> </svg>',
    'print':'<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-stroke" d="M5 10.5V14H12V10.5" stroke="white" stroke-width="2"/> <path class="maincolor-stroke" d="M5 12H1V4.5H16V12H12" stroke="white" stroke-width="2"/> <path class="maincolor-stroke" d="M12 4V1H5V4" stroke="white" stroke-width="2"/> </svg>',
    'hash':'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <line class="maincolor-stroke" x1="5" x2="5" y2="16" stroke="white" stroke-width="2"/> <line class="maincolor-stroke" y1="5" x2="16" y2="5" stroke="white" stroke-width="2"/> <line class="maincolor-stroke" y1="11" x2="16" y2="11" stroke="white" stroke-width="2"/> <line class="maincolor-stroke" x1="11" x2="11" y2="16" stroke="white" stroke-width="2"/> </svg>',
    
    'darkMode':'<svg width="16" height="16" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path class="maincolor-fill" fill-rule="evenodd" clip-rule="evenodd" d="M12.6487 0.770308C9.32089 2.17011 7 5.32828 7 9C7 12.6717 9.32089 15.8299 12.6487 17.2297C11.5334 17.7249 10.2988 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C10.2988 0 11.5334 0.275137 12.6487 0.770308Z" fill="#3C3C3C"/> </svg>',
    'lightMode':'<svg width="20" height="20" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle class="maincolor-fill" cx="14" cy="14" r="8" fill="#076FCF"/> <line class="maincolor-stroke" x1="14" y1="1" x2="14" y2="4" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> <line class="maincolor-stroke" x1="14" y1="24" x2="14" y2="27" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> <line class="maincolor-stroke" x1="25" y1="14" x2="28" y2="14" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> <line class="maincolor-stroke" x1="1" y1="14" x2="4" y2="14" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> <line class="maincolor-stroke" x1="5" y1="23.1213" x2="7.12132" y2="21" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> <line class="maincolor-stroke" x1="22" y1="7.12131" x2="24.1213" y2="4.99999" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> <line class="maincolor-stroke" x1="21.4142" y1="21" x2="23.5355" y2="23.1213" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> <line class="maincolor-stroke" x1="4.41421" y1="5" x2="6.53553" y2="7.12132" stroke="#076FCF" stroke-width="2" stroke-linecap="round"/> </svg>',
    undefined:''
}

function Icon(props) {
    const getImage = (name)=>{
        if(name == 'language'){
            return '<span class="topbutton-language">'+props.store.getState().app.languageCode+'</span>';
        }else{
            return iconData[name];
        }
    }
  return (
    <div className='Icon' dangerouslySetInnerHTML={{__html: getImage(props.image)}}></div>
  );
}

export default Icon;