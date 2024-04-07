import React, { useEffect, useRef, Component } from 'react';

import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Context } from '@ckeditor/ckeditor5-core';


// import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';

import './CKEditor.css';

import { Comments } from '@ckeditor/ckeditor5-comments';


import { createObject } from '@steedos-widgets/amis-lib';

const defaultConfig={
  plugins: [
    // Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,

    // Paid
    Comments
  ],
  comments: {
    editorConfig: {
        // The list of plugins that will be included in the comments editors.
        extraPlugins: [ Bold, Italic, List, Autoformat ]
    }
  },
  toolbar: {
    items: [
        'alignment',
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
        '|', 'comment', 'commentsArchive',
    ]
  },
}


export const AmisCKEditorCommercial = ( {
  config, 
  data: amisData,
  value = "", 
  onChange: amisOnChange,
  dispatchEvent: amisDispatchEvent,
  ...props
} ) => {
  const editorRef = useRef(null)

  console.log(amisData)
  console.log(props)
  class CommentsIntegration {
    editor;
  
    constructor( editor ) {
      this.editor = editor;
    }
  
    init() {
      const currentUser = amisData?.__super?.global?.user || { userId: "test", name: "test" };
      const userId = currentUser?.userId || "test";
      const users = [
        currentUser && {
          id: currentUser.userId,
          name: currentUser.name,
          // Note that the avatar is optional.
          avatar: `${amisData?.__super?.context?.rootUrl}/avatar/${currentUser.userId}`
        }
      ]
      const commentThreads = [];

      const usersPlugin = this.editor.plugins.get( 'Users' );
      const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );
  
      // Load the users data.
      for ( const user of users ) {
        usersPlugin.addUser( user );
      }
  
      // Set the current user.
      usersPlugin.defineMe( userId );
  
      // Load the comment threads data.
      for ( const commentThread of commentThreads ) {
        commentThread.isFromAdapter = true;
  
        commentsRepositoryPlugin.addCommentThread( commentThread );
      }
    }
  }

  const configJSON = {
    ...defaultConfig,
    ...config,

		extraPlugins: [ CommentsIntegration ],
    commentsOnly: props.static === true,
  }

  if (props.static) {
    configJSON.toolbar.items = ['comment', 'commentsArchive'];
  }
  
  return (
    <CKEditorContext context={ Context }>
      <CKEditor 
        editor={ ClassicEditor }
        data={value}
        config={configJSON}
        onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            editorRef.current = editor;
            console.log( 'Editor is ready to use!', editorRef.current );
        } }
        onChange={ async ( event ) => {
          if (!amisDispatchEvent || !amisOnChange || !editorRef.current)
            return 
          console.log( event );

          // 支持 amis OnEvent.change
          const rendererEvent = await amisDispatchEvent(
            'change',
            createObject(amisData, {
              value
            }),
            editorRef.current
          );
          if (rendererEvent?.prevented) {
            return;
          }

          console.log( "editorRef.getData()", editorRef.current.getData() );
          setTimeout(()=> amisOnChange(editorRef.current.getData()), 500);
          
        } }
        onBlur={ ( event, editor ) => {
            console.log( 'Blur.', editor );
        } }
        onFocus={ ( event, editor ) => {
            console.log( 'Focus.', editor );
        } }
      />
    </CKEditorContext>
  )
}