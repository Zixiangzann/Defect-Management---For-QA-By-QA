import { useState, useEffect } from 'react';
import { htmlDecode } from '../tools'

/// wysiwyg
import { EditorState, ContentState, convertFromHTML  } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import "../../styles/react-draft-wysiwyg.css"

//mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//template
import defectTemplate from './template';

const WYSIWYG = (props) => {

    const [editorData, setEditorData] = useState({
        editorState: EditorState.createEmpty()
    })

    const onEditorStateChange = (editorData) => {
        let HTMLdata = stateToHTML(editorData.getCurrentContent());
        setEditorData({
            editorState: editorData
        })
        props.setEditorState(HTMLdata)
    }

    /// edit
    useEffect(()=>{
        console.log(props.editorContent)
        if(props.editorContent){
            const blockFromHtml = htmlToDraft(htmlDecode(props.editorContent));
            const { contentBlocks, entityMap } = blockFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks,entityMap)

            setEditorData({
                editorState: EditorState.createWithContent(contentState)
            })
        }
    },[props.editorContent])


    const checkError = () => {
        if (props.onError || (props.onError && props.editorBlur)) {
            return true
        }
        return false
    }

    //generate template
    const generateTemplateBtn = (template) => {
        console.log(defectTemplate)
        if(props.showGenerateTemplate){
            return(
                <Box sx={{display:'flex', justifyContent:'flex-end'}}>
                <Button
                onClick={()=>{
                    const blockFromHtml = htmlToDraft(template);
                    const { contentBlocks, entityMap } = blockFromHtml;
                    const contentState = ContentState.createFromBlockArray(contentBlocks,entityMap)
        
                    setEditorData({
                        editorState: EditorState.createWithContent(contentState)
                    })
                }}>
                    Generate Template
                </Button>
                </Box>
            )
        }
    } 

    return (
        <div>
            {generateTemplateBtn(defectTemplate)}

            <Editor
                editorState={editorData.editorState}
                onEditorStateChange={onEditorStateChange}
                wrapperClassName={`demo-wrapper ${checkError() ? 'error' : ''}`}
                editorClassName="demo-editor"
                onBlur={props.setEditorBlur}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'colorPicker', 'link', 'emoji', 'history'],
                }}
                contentState
            />
        </div>
    )

}

export default WYSIWYG;