import { MI_INPUT_TYPES } from "./constants"

export const BLOCK_STYLE_NAMES = {
    width:'width',
    height:'height',
    displayType:'display',
    alignVertical:'alignVertical',
    alignHorizontal:'alignHorizontal',
    displayType:'displayType',
    marginTop:'marginTop',
    marginBottom:'marginBottom',
    marginLeft:'marginLeft',
    marginRight:'marginRight',
    fontFamily:'fontFamily',
    fontSize:'fontSize',
    fontColor:'fontColor',
    backgroundColor:'backgroundColor',
    fontBold:'fontBold',
    fontItalic:'fontItalic',
    fontUnderline:'fontUnderline',
    customStyle:'customStyle'
}

export const BLOCK_STYLE_SETTINGS = {
    [BLOCK_STYLE_NAMES.width] : {
        inputType: MI_INPUT_TYPES.size,
        initialValue:'auto',
    },
    [BLOCK_STYLE_NAMES.height] : {
        type:MI_INPUT_TYPES.size,
        initialValue:'auto',
    },
    [BLOCK_STYLE_NAMES.displayType] : {
        type:MI_INPUT_TYPES.selector,
        initialValue:'inherit',
        selectorOptions:[
            ['Inline','inline'],
            ['Block','block'],
            ['Flex','flex'],
            ['Inherit','inherit']
        ],
    },
    [BLOCK_STYLE_NAMES.alignVertical] : {
        type:MI_INPUT_TYPES.selector,
        initialValue:'inherit',
        selectorOptions:[
            ['Inherit','inherit'],
            ['Top','start'],
            ['Center','center'],
            ['Bottom','end'],
            ['Space around','space-around'],
            ['Space between','space-between'],
            ['Space evenly','space-evenly'],
            ['Space evenly','space-evenly'],
        ],
    },
    [BLOCK_STYLE_NAMES.alignHorizontal] : {
        type:MI_INPUT_TYPES.selector,
        initialValue:'inherit',
        selectorOptions:[
            ['Inherit','inherit'],
            ['Top','start'],
            ['Center','center'],
            ['Bottom','end'],
            ['Space around','space-around'],
            ['Space between','space-between'],
            ['Space evenly','space-evenly'],
            ['Space evenly','space-evenly'],
        ],
    },

    [BLOCK_STYLE_NAMES.marginTop] : {
        type:MI_INPUT_TYPES.size,
        initialValue:'0mm',
    },
    [BLOCK_STYLE_NAMES.marginBottom] : {
        type:MI_INPUT_TYPES.size,
        initialValue:'0mm',
    },
    [BLOCK_STYLE_NAMES.marginLeft] : {
        type:MI_INPUT_TYPES.size,
        initialValue:'0mm',
    },
    [BLOCK_STYLE_NAMES.marginRight] : {
        type:MI_INPUT_TYPES.size,
        initialValue:'0mm',
    },

    [BLOCK_STYLE_NAMES.fontFamily] : {
        type:MI_INPUT_TYPES.selector,
        initialValue:'inherit',
        selectorOptions:[
            ['Arial','Arial'],
            ['Times New Roman','Times New Roman'],
            ['Calibri','Calibri'],
            ['Roboto','Roboto'],
            ['Inherit','inherit']
        ],
    },
    [BLOCK_STYLE_NAMES.fontSize] : {
        type:MI_INPUT_TYPES.size,
        initialValue:'inherit',
    },
    [BLOCK_STYLE_NAMES.fontColor] : {
        type:MI_INPUT_TYPES.color,
        initialValue:'inherit',
    },
    [BLOCK_STYLE_NAMES.backgroundColor] : {
        type:MI_INPUT_TYPES.color,
        initialValue:'inherit',
    },
    [BLOCK_STYLE_NAMES.fontBold] : {
        type:MI_INPUT_TYPES.selector,
        initialValue:'inherit',
        selectorOptions:[
            ['Thin','100'],
            ['Normal','400'],
            ['Bold','600'],
            ['Bolder','900'],
            ['Inherit','inherit'],
        ],
    },
    [BLOCK_STYLE_NAMES.fontItalic] : {
        type:MI_INPUT_TYPES.selector,
        initialValue:'inherit',
        selectorOptions:[    
            ['Not italic','none'],
            ['Italic','italic'],
            ['Inherit','inherit'],
        ],
    },
    [BLOCK_STYLE_NAMES.fontUnderline] : {
        type:MI_INPUT_TYPES.selector,
        initialValue:'inherit',
        selectorOptions:[  
            ['Non underline','none'],
            ['Underline','underline'],
            ['Inherit','inherit'],
        ],
    },
    [BLOCK_STYLE_NAMES.customStyle] : {
        type:MI_INPUT_TYPES.textarea,
        initialValue:'',
    },
}

export const getBlockSettings = ( blockName )=> {
    return BLOCK_STYLE_SETTINGS?.[blockName]
}