#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#Copyright (c) 2013, Playful Invention Company.

#Permission is hereby granted, free of charge, to any person obtaining a copy
#of this software and associated documentation files (the "Software"), to deal
#in the Software without restriction, including without limitation the rights
#to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#copies of the Software, and to permit persons to whom the Software is
#furnished to do so, subject to the following conditions:

#The above copyright notice and this permission notice shall be included in
#all copies or substantial portions of the Software.

#THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
#THE SOFTWARE.

# -----

# Grid paint activity
#
# by Brian Silverman
# adapted for the XO by Lionel Laské
#

# GridPaint has been kept extremely minimal as an explicit design choice.
# If you want to add features please make a fork with a different name.
# Thanks in advance


from gi.repository import Gtk
import logging
import os

from gettext import gettext as _

from sugar3.activity import activity
from sugar3.graphics.toolbarbox import ToolbarBox
from sugar3.graphics.toolbutton import ToolButton
from sugar3.activity.widgets import ActivityButton
from sugar3.activity.widgets import TitleEntry
from sugar3.activity.widgets import StopButton
from sugar3.activity.widgets import ShareButton
from sugar3.activity.widgets import DescriptionItem
from sugar3.presence import presenceservice

from gi.repository import WebKit
import logging
import gconf

from datetime import date

from enyo import Enyo


class GridpaintActivity(activity.Activity):
    """GridpaintActivity class as specified in activity.info"""

    def __init__(self, handle):
        """Set up the activity."""
        activity.Activity.__init__(self, handle)

        self.max_participants = 1

        self.make_toolbar()
        self.make_mainview()

        self.context = None


    def init_context(self, args):
        self.enyo.send_message("load-gallery", self.context)


    def make_mainview(self):
        """Create the activity view"""
        # Create global box
        vbox = Gtk.VBox(True)

        # Create webview
        scrolled_window = Gtk.ScrolledWindow()
        self.webview = webview  = WebKit.WebView()
        scrolled_window.add(webview)
        webview.show()
        vbox.pack_start(scrolled_window, True, True, 0)
        scrolled_window.show()

        # Activate Enyo interface
        self.enyo = Enyo(webview)
        self.enyo.connect("ready", self.init_context)
        self.enyo.connect("save-gallery", self.save_gallery)

        # Go to first page
        web_app_page = os.path.join(activity.get_bundle_path(), "html/index.html")
        self.webview.load_uri('file://' + web_app_page)

        # Display all
        self.set_canvas(vbox)
        vbox.show()


    def make_toolbar(self):
        # toolbar with the new toolbar redesign
        toolbar_box = ToolbarBox()

        activity_button = ActivityButton(self)
        toolbar_box.toolbar.insert(activity_button, 0)
        activity_button.show()

        title_entry = TitleEntry(self)
        toolbar_box.toolbar.insert(title_entry, -1)
        title_entry.show()

        description_item = DescriptionItem(self)
        toolbar_box.toolbar.insert(description_item, -1)
        description_item.show()

        share_button = ShareButton(self)
        toolbar_box.toolbar.insert(share_button, -1)
        share_button.show()

        separator = Gtk.SeparatorToolItem()
        separator.props.draw = False
        separator.set_expand(True)
        toolbar_box.toolbar.insert(separator, -1)
        separator.show()

        stop_button = StopButton(self)
        toolbar_box.toolbar.insert(stop_button, -1)
        stop_button.show()

        self.set_toolbar_box(toolbar_box)
        toolbar_box.show()


    def write_file(self, file_path):
        "Called when activity is saved, get the current context in Enyo"
        if self.context is None:
            return
        self.file_path = file_path
        file = open(self.file_path, 'w')
        try:
            file.write(self.context['gallery']+'\n')
            file.write(self.context['mode']+'\n')
            file.write(str(self.context['selected'])+'\n')
        finally:
            file.close()


    def save_gallery(self, context):
        "Called by JavaScript to save the current gallery"
        self.context = context


    def read_file(self, file_path):
        "Called when activity is loaded, load the current context in the file"
        file = open(file_path, 'r')
        self.context = None
        try:
            gallery = file.readline().strip('\n')
            mode = file.readline().strip('\n')
            selected = file.readline().strip('\n')
            self.context = { 'gallery': gallery, 'mode': mode, 'selected': selected }
        finally:
            file.close()
