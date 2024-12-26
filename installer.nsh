// installer.nsh
!macro customUnInstall
  ; 删除注册表项
  DeleteRegKey HKLM "Software\todolist"
  DeleteRegKey HKCU "Software\todolist"
  
  ; 删除应用数据
  RMDir /r "$APPDATA\todolist"
  RMDir /r "$LOCALAPPDATA\todolist"
  
  ; 删除开始菜单快捷方式
  Delete "$SMPROGRAMS\todolist\*.*"
  RMDir "$SMPROGRAMS\todolist"
  
  ; 删除桌面快捷方式
  Delete "$DESKTOP\todolist.lnk"
!macroend