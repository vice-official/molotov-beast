document.addEventListener('DOMContentLoaded', function() {
  const chatMessages = document.querySelectorAll('.chat-message');
  const chatAvatars = document.querySelectorAll('.chat-avatar');
  const voiceMessages = document.querySelectorAll('.voice-message');
  
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 1.2 && 
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  function checkVisibility() {
    chatMessages.forEach((message, index) => {
      if (isElementInViewport(message)) {
        setTimeout(() => {
          message.classList.add('visible');
          if (chatAvatars[index]) {
            chatAvatars[index].classList.add('visible');
          }
        }, index * 200);
      }
    });
    
    voiceMessages.forEach((voiceMessage, index) => {
      if (isElementInViewport(voiceMessage)) {
        setTimeout(() => {
          voiceMessage.classList.add('visible');
        }, (index + chatMessages.length) * 200 + 300);
      }
    });
  }

  window.addEventListener('load', checkVisibility);
  window.addEventListener('scroll', checkVisibility);
  
  checkVisibility();
});

function toggleVoice(button) {
  const icon = button.querySelector('i');
  const voiceBars = button.closest('.voice-player').querySelectorAll('.voice-bar');
  
  if (icon.classList.contains('fa-play')) {
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
    
    voiceBars.forEach((bar, index) => {
      const randomHeight = Math.floor(Math.random() * 20) + 4;
      bar.style.height = `${randomHeight}px`;
      bar.style.animation = `voiceBarAnimation ${0.5 + Math.random() * 0.5}s infinite alternate`;
      bar.style.animationDelay = `${index * 0.1}s`;
    });
    
    setTimeout(() => {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      voiceBars.forEach(bar => {
        bar.style.animation = 'none';
        bar.style.height = '6px';
      });
    }, 24000);
  } else {
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
    voiceBars.forEach(bar => {
      bar.style.animation = 'none';
      bar.style.height = '6px';
    });
  }
}
const style = document.createElement('style');
style.textContent = `
  @keyframes voiceBarAnimation {
    0% {
      height: 6px;
    }
    100% {
      height: 18px;
    }
  }
`;
document.head.appendChild(style);
