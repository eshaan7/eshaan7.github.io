
window.onload = function() {

  var messagesEl = document.querySelector('.messages');
  var typingSpeed = 9;
  var loadingText = '<b>•</b><b>•</b><b>•</b>';
  var messageIndex = 0;

  var getCurrentTime = function() {
    var date = new Date();
    var hours =  date.getHours();
    var minutes =  date.getMinutes();
    var current = hours + (minutes * .01);
    if (current >= 5 && current < 19) return 'Have a nice day <i class="twa twa-sunny"></i>';
    if (current >= 19 && current < 22) return 'Have a nice evening<i class="twa twa-sunrise-over-mountains"></i>';
    if (current >= 22 || current < 5) return 'Have a good night <i class="twa twa-stars"></i>';
  }

  var messages = [
    'Hey there <i class="twa twa-wave"></i>',
    'I\'m Eshaan',
    'I\'m a sophomore at USICT. I have no idea what I am doing with my life.',
    'I play CTFs as <a target="_blank" href="https://www.abs0lut3pwn4g3.cf/">Abs0lut3Pwn4g3</a>.<br/>I serve as part of the core team at <a target="_blank" href="https://dc91120.org/">DEF CON 91120 NCR Group</a><br/><a target="_blank" href="https://medium.com/@eshaan7">Blog on Medium</a>',
    'Get in touch: <br><a target="_blank" href="https://linkedin.com/in/eshaan7">linkedin.com/in/Eshaan7</a><br><a target="_blank" href="https://twitter.com/mask0fmydisguis">twitter.com/mask0fmydisguis</a><br/><a target="_blank" href="https://github.com/Eshaan7">github.com/Eshaan7</a>',
    'My projects : <br/><a target="_blank" href="https://github.com/abs0lut3pwn4g3/RTB-CTF-Framework">RootTheBox - A CTF Framework in Flask</a><br/><a target="_blank" href="https://github.com/Eshaan7/IPU_GPA_Calculator">IPU GPA Calculator - PWA in Flask</a><br/><a target="_blank" href="https://github.com/Eshaan7/PacketSniffer">PacketSniffer - Python</a>',
    'I am looking for pentesting internships: <a target="_blank" href="https://drive.google.com/file/d/1BLJXR_rFFLP7wobE-Fog363JcbH5uttQ/view">My Resume</a>',
    getCurrentTime(),
    '<i class="twa twa-eyes"></i> E.',
  ]

  var getFontSize = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var pxToRem = function(px) {
    return px / getFontSize() + 'rem';
  }

  var createBubbleElements = function(message, position) {
    var bubbleEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }

  var getDimentions = function(elements) {
    return dimensions = {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    }
  }

  var sendMessage = function(message, position) {
    var loadingDuration = (message.length * typingSpeed) + 200;
    var elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 50);
  }

  var sendMessages = function() {
    var message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, (message.length * typingSpeed) + anime.random(900, 1200));
  }

  sendMessages();

}
