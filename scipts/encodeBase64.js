export const encodeBase64 = (userName, passeWord) => {
    const str = `${userName}:${passeWord}`
    var encoder = new TextEncoder();
    var byteArray = encoder.encode(str);
    var base64String = arrayBufferToBase64(byteArray);
    return base64String;
  }
  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }