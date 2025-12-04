let userData = {
    nama: '',
    ratingBintang: 1,
    catatan: '',
    ubah: '',
    hindari: '',
    sukaSifat: '',
    sukaBeneran: ''
};

let currentRating = 1;

function openEnvelope() {
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelope-container');
    
    envelope.classList.add('opened');
    
    setTimeout(() => {
        envelopeContainer.classList.add('opening');
    }, 800);
    
    setTimeout(() => {
        envelopeContainer.classList.add('hidden');
        document.getElementById('welcome-screen').classList.remove('hidden');
    }, 1800);
}

function showCard(cardId) {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('hidden');
    });
    const targetCard = document.getElementById(cardId);
    targetCard.classList.remove('hidden');
    targetCard.style.animation = 'none';
    setTimeout(() => {
        targetCard.style.animation = 'fadeInUp 0.6s ease';
    }, 10);
}

function startQuest() {
    const nama = document.getElementById('nama').value.trim();
    if (!nama) {
        showNotification('Hei, isi dulu nama kamu ya!');
        return;
    }
    userData.nama = nama;
    showCard('quest1');
}

function nextQuest(questNumber) {
    if (questNumber === 5) {
        userData.catatan = document.getElementById('catatan').value || '-';
    } else if (questNumber === 6) {
        userData.ubah = document.getElementById('ubah').value || '-';
    } else if (questNumber === 7) {
        userData.hindari = document.getElementById('hindari').value || '-';
    }
    
    showCard('quest' + questNumber);
    
    if (questNumber === 8) {
        document.getElementById('namaDisplay').textContent = userData.nama;
    }
}

function updateRating(value) {
    currentRating = parseInt(value);
    document.getElementById('starCount').textContent = currentRating;
    
    updateStarVisual(currentRating);
    updateRatingLabel(currentRating);
    
    const ratingBtn = document.getElementById('ratingNextBtn');
    if (currentRating <= 1) {
        ratingBtn.classList.add('escape-btn');
    } else {
        ratingBtn.classList.remove('escape-btn');
    }
}

function updateStarVisual(count) {
    const container = document.getElementById('starVisual');
    container.innerHTML = '';
    
    const displayCount = Math.min(count, 30);
    for (let i = 0; i < displayCount; i++) {
        const star = document.createElement('span');
        star.className = 'mini-star';
        star.textContent = '⭐';
        star.style.animationDelay = (i * 0.02) + 's';
        container.appendChild(star);
    }
    
    if (count > 30) {
        const more = document.createElement('span');
        more.className = 'mini-star';
        more.textContent = '+' + (count - 30);
        more.style.color = '#ff69b4';
        more.style.fontWeight = 'bold';
        container.appendChild(more);
    }
}

function updateRatingLabel(rating) {
    const label = document.getElementById('ratingLabel');
    if (rating <= 1) {
        label.textContent = 'Hmm... kasih yang lebih dong! 🥺';
    } else if (rating <= 20) {
        label.textContent = 'Masih kurang nih... 😢';
    } else if (rating <= 40) {
        label.textContent = 'Lumayan sih... 😊';
    } else if (rating <= 60) {
        label.textContent = 'Wah mantap! 😍';
    } else if (rating <= 80) {
        label.textContent = 'Keren banget! 🌟';
    } else {
        label.textContent = 'LUAR BIASA! Makasih ya! 💖💖💖';
    }
}

function changeRating(amount) {
    let newRating = currentRating + amount;
    if (newRating < 1) newRating = 1;
    if (newRating > 90) newRating = 90;
    
    document.getElementById('ratingSlider').value = newRating;
    updateRating(newRating);
}

function submitRating() {
    if (currentRating <= 1) {
        moveButton(document.getElementById('ratingNextBtn'));
        showNotification('Kasih rating yang lebih dong!');
        return;
    }
    userData.ratingBintang = currentRating;
    nextQuest(4);
}

function answerSuka(answer) {
    userData.sukaSifat = answer;
    nextQuest(8);
}

function moveButton(btn) {
    const card = btn.closest('.card');
    const cardRect = card.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    
    const maxX = cardRect.width - btnRect.width - 60;
    const maxY = cardRect.height - btnRect.height - 60;
    
    const randomX = (Math.random() - 0.5) * maxX;
    const randomY = (Math.random() - 0.5) * maxY;
    
    btn.style.position = 'relative';
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
    btn.style.transition = 'all 0.2s ease';
}

function finalAnswer(answer) {
    userData.sukaBeneran = answer;
    sendData();
}

function showKenapaBox() {
    document.getElementById('kenapaBox').classList.remove('hidden');
}

async function sendWithKenapa() {
    const kenapa = document.getElementById('kenapa').value || '-';
    userData.sukaBeneran = 'No - Alasan: ' + kenapa;
    await sendData();
}

function createConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#ff69b4', '#ff1493', '#ffd700', '#ff6b6b', '#4CAF50', '#ffb6c1'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        container.appendChild(confetti);
    }
}

async function sendData() {
    try {
        const response = await fetch('/api/send-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        document.getElementById('namaFinal').textContent = userData.nama;
        
        const finalMessage = document.getElementById('finalMessage');
        finalMessage.innerHTML = 'Hallo <strong>' + userData.nama + '</strong>, makasih telah join di website ini ya! Website ini di program langsung ke Apis. Makasih udh join tim support Valuamor.id! 💕';
        
        showCard('finalScreen');
        createConfetti();
        
        showNotification('Hallo ' + userData.nama + ', makasih telah join di website ini! Website ini di program langsung ke Apis. Makasih udh join tim support Valuamor.id!');
        
        const waNumber = result.whatsappNumber || '6281330032894';
        const waMessage = encodeURIComponent(
            'Iya aku suka kok 💕\n\n' +
            '📋 DATA:\n' +
            '👤 Nama: ' + userData.nama + '\n' +
            '⭐ Rating: ' + userData.ratingBintang + ' bintang\n' +
            '📝 Catatan: ' + userData.catatan + '\n' +
            '🔄 Yang harus diubah: ' + userData.ubah + '\n' +
            '🚫 Yang harus dihindari: ' + userData.hindari
        );
        
        setTimeout(() => {
            window.open('https://wa.me/' + waNumber + '?text=' + waMessage, '_blank');
        }, 2500);
        
    } catch (error) {
        console.error('Error:', error);
        
        document.getElementById('namaFinal').textContent = userData.nama;
        
        const finalMessage = document.getElementById('finalMessage');
        finalMessage.innerHTML = 'Hallo <strong>' + userData.nama + '</strong>, makasih telah join di website ini ya! Website ini di program langsung ke Apis. Makasih udh join tim support Valuamor.id! 💕';
        
        showCard('finalScreen');
        createConfetti();
        
        showNotification('Hallo ' + userData.nama + ', makasih telah join di website ini! Website ini di program langsung ke Apis. Makasih udh join tim support Valuamor.id!');
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    notification.style.animation = 'none';
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.5s ease, pulse 2s infinite';
    }, 10);
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 6000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateRating(1);
});
