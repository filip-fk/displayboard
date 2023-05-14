#!/usr/bin/env python
import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.QtWebEngineWidgets import *

class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.setGeometry(100, 100, 1920, 1080)
        self.setWindowTitle("Weather and Bus Display")

        self.browser1 = QWebEngineView()
        self.browser2 = QWebEngineView()

        self.browser1.setUrl(QUrl("https://www.meteoswiss.admin.ch/local-forecasts/zurich/8046.html#forecast-tab=detail-view"))
        self.browser2.setUrl(QUrl.fromLocalFile(QFileInfo("./sbb.html").absoluteFilePath()))
        self.browser2.page().profile().downloadRequested.connect(self.on_downloadRequested)

        self.splitter = QSplitter()
        self.splitter.addWidget(self.browser1)
        self.splitter.addWidget(self.browser2)

        self.splitter.setSizes([int(3*self.width()/4), int(self.width()/4)])     
        self.splitter.setStretchFactor(0, 3)                                
        self.splitter.setStretchFactor(1, 1)                         

        
        self.setCentralWidget(self.splitter)

        self.update_weather()
        self.update_bus()

    def scroll_down(self):
        self.browser1.page().runJavaScript("window.scrollBy(0, 350);")

    def update_weather(self):
        self.browser1.reload()  
        QTimer.singleShot(1000, self.scroll_down)
        QTimer.singleShot(300000, self.update_weather)

    def update_bus(self):
        self.browser2.reload()
        QTimer.singleShot(30000, self.update_bus)

    def on_downloadRequested(self, download):
        print("on_downloadRequested")
        download.setDownloadDirectory("./")
        download.accept()

app = QApplication(sys.argv)
QApplication.setApplicationName("Weather and Bus Display")
window = MainWindow()
window.show()
app.exec_()