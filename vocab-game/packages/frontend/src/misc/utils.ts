export const getAuthHeaders = (isJson: boolean) => {
  const logged = JSON.parse(sessionStorage.getItem('MadVocab-User'))
  const token = logged ? logged.token : '';
  const uid = logged ? logged.uid : '';
  return isJson ? {
      'Authorization': token,
      'user': uid,
      'Content-Type': 'application/json'
  } : {
    'Authorization': token,
    'user': uid
  }
}

export const getLoggedUser = () => {
  const logged = JSON.parse(sessionStorage.getItem('MadVocab-User'))
  return logged && logged.username ? logged : null;
}