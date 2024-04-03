import React, { useEffect, useRef } from 'react';

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


	// Application data will be available under a global variable `appData`.
	const appData : any = {};

	// Users data.
	appData.users = [
		{
			id: 'user-1',
			name: 'Joe Doe',
			// Note that the avatar is optional.
			avatar: 'https://randomuser.me/api/portraits/thumb/men/26.jpg'
		},
		{
			id: 'user-2',
			name: 'Ella Harper',
			avatar: 'https://randomuser.me/api/portraits/thumb/women/65.jpg'
		}
	];

	// The ID of the current user.
	appData.userId = 'user-1';

	// Comment threads data.
	appData.commentThreads = [
  ]
  
class CommentsIntegration {
  editor;

  constructor( editor ) {
    this.editor = editor;
  }

  init() {
    const usersPlugin = this.editor.plugins.get( 'Users' );
    const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );

    // Load the users data.
    for ( const user of appData.users ) {
      usersPlugin.addUser( user );
    }

    // Set the current user.
    usersPlugin.defineMe( appData.userId );

    // Load the comment threads data.
    for ( const commentThread of appData.commentThreads ) {
      commentThread.isFromAdapter = true;

      commentsRepositoryPlugin.addCommentThread( commentThread );
    }
  }
}

export const AmisCKEditorCommercial = ( {config, ...props} ) => {
  
  const configJSON = {
    ...defaultConfig,
    ...config,

		extraPlugins: [ CommentsIntegration ],
  }
  
  return (
    <CKEditorContext context={ Context }>
      <CKEditor 
        editor={ ClassicEditor }
        data="<p>Hello from CKEditor&nbsp;5!</p>"
        config={configJSON}
        onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            console.log( 'Editor is ready to use!', editor );
        } }
        onChange={ ( event ) => {
            console.log( event );
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