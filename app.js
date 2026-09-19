document.getElementById('cameraInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById('capture-section').style.display = 'none';
  document.getElementById('loader').style.display = 'block';
  document.getElementById('result-card').style.display = 'none';

  const formData = new FormData();
  formData.append('image', file);
  formData.append('userId', 'local-tester-001');

  try {
    const res = await fetch('/api/scan-image', { method: 'POST', body: formData });
    const json = await res.json();
    
    if (json.status === 'success') {
      const w = json.data;
      document.getElementById('r-word').innerText = w.word;
      document.getElementById('r-pronounce').innerText = '[' + w.phonetic + ']';
      document.getElementById('r-trans').innerText = w.translations.ko;
      
      const exHtml = w.exampleSentences.map(ex => `<div class="word-example">${ex}</div>`).join('');
      document.getElementById('r-examples').innerHTML = exHtml;

      document.getElementById('loader').style.display = 'none';
      document.getElementById('result-card').style.display = 'block';
      
      // Store in memory for save action
      window.currentWord = w;
    }
  } catch (err) {
    alert('오류 발생: ' + err.message);
    document.getElementById('loader').style.display = 'none';
    document.getElementById('capture-section').style.display = 'block';
  }
});

document.getElementById('saveBtn').addEventListener('click', () => {
  if(window.currentWord) {
    // In production, save to local IndexedDB and sync to backend
    alert(`'${window.currentWord.word}' 단어가 복습 스케줄(Next: ${new Date(window.currentWord.nextReview).toLocaleTimeString()})에 추가되었습니다.`);
    
    // Reset UI
    document.getElementById('result-card').style.display = 'none';
    document.getElementById('capture-section').style.display = 'block';
  }
});