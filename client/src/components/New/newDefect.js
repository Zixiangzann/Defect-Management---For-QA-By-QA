import React, { useState } from 'react'
import Select, { Option, ReactSelectProps } from "react-select";

import { Formik } from 'formik'
import * as Yup from 'yup';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { ContentState, Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import convert from 'htmr';
import draftToHtml from 'draftjs-to-html';
import '../../styles/newDefect.css'

import { useSelector, useDispatch } from 'react-redux'


function NewDefect() {

    // const users = useSelector((state) => state.users.users)
    const users = ["user1","user2","user3"]

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const [description, setDescription] = useState(null);

    const handleEditorChange = (state) => {
        setEditorState(state);

        //Convert from draftjs to html and later store it as html to db.
        setDescription(convert(draftToHtml(convertToRaw(editorState.getCurrentContent()))));
    }

    return (
        <>
            <h1>Create new Defect</h1>
            <Formik
                enableReinitialize
                initialValues={{
                    title: '',
                    issuetype: 'bug',
                    priority: 'low',
                    description: ''

                }}
                validationSchema={
                    Yup.object({
                        title: Yup.string().required("Field cannot be empty"),
                        issuetype: Yup.string(),
                        priority: Yup.string(),
                        description: Yup.string(),
                    })}
                onSubmit={(values) => {
                    console.log(values);
                    console.log(description);
                    console.log(values.assignee);
                    console.log(values.priority);
                    // values.assignee.map(item=>console.log(item.value));
                    //to be dispatch and add it to db later
                    // title: values.title
                    // issuetype: values.issuetype,
                    // priority: values.priority,
                    // description: description
                }}
            >
                {
                    ({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                    }) => (
                        <div className='create-new-defect'>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor='title'>Title:</label>
                                <input
                                    type='text'
                                    name='title'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                />
                                <label htmlFor='issuetype'>Issue Type:</label>
                                <Select
                                    className='issuetype'
                                    name='issuetype'
                                    options={[
                                        {label:'Bug', value:'Bug'},
                                        {label:'Incident',value:'Incident'}
                                    ]}
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    onChange={option=>setFieldValue('issuetype',option.value)}
                                />
                                <label htmlFor='priority'>Severity:</label>
                                <Select
                                    className='priority'
                                    name='priority'
                                    options={[
                                        {label:'Low', value:'Low'},
                                        {label:'Medium',value:'Medium'},
                                        {label:'High',value:'High'},
                                        {label:'Showstopper',value:'Showstopper'}
                                    ]}
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    onChange={option=>setFieldValue('priority',option.value)}
                                />
                                <label htmlFor='assignee'>Assignee: </label>
                                <Select
                                    className='assignee'
                                    name='assignee'
                                    options={
                                       users.map((user)=>({
                                        label: user,
                                        value: user
                                       }))
                                    }
                                    isMulti
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    onChange={option => setFieldValue("assignee", option)}
                                    allowSelectAll={true}
                                    // value={values.assignee}
                                />
                                <label>Defect Description:</label>
                                <Editor
                                    editorState={editorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={handleEditorChange}
                                />

                                <button type="submit">
                                    Create Issue
                                </button>
                                <button type="cancel">
                                    Cancel
                                </button>
                            </form>

                            {/* testing purpose.. to be removed */}
                            <h3>Title: {values.title}</h3>
                            <p>Issue Type: {values.issuetype.toUpperCase()}</p>
                            <p>Severity: {values.priority.toUpperCase()}</p>
                            {convert(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
                        </div>
                    )}
            </Formik>

        </>
    )
}

export default NewDefect;