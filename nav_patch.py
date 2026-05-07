import re
from pathlib import Path

root = Path('.')
html_files = sorted(root.glob('*.html'))
new_css = '''        .side-nav {
            position: fixed;
            top: 56px;
            right: 0;
            left: auto;
            bottom: 0;
            width: 280px;
            height: calc(100vh - 56px);
            padding: 32px 22px;
            background: linear-gradient(180deg, #00122d 0%, #003366 100%);
            color: #fff;
            box-shadow: -8px 0 30px rgba(0,0,0,0.18);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1200;
            display: flex;
            flex-direction: column;
        }
        .side-nav.open { transform: translateX(0); }
'''

nav_toggle_css = '''        .nav-toggle {
            position: fixed;
            top: 72px;
            right: 20px;
            width: 54px;
            height: 54px;
            border: none;
            border-radius: 50%;
            background: #ffd700;
            color: #003366;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 14px 30px rgba(0,0,0,0.18);
            z-index: 1300;
            cursor: pointer;
            transition: transform 0.3s ease, background 0.3s ease;
        }
        .nav-toggle:hover { transform: scale(1.05); background: #ffc107; }
        .nav-toggle.open { right: 302px; }
        .side-nav.open + .page-wrap { margin-right: 300px; }
'''

new_pagewrap = '        .page-wrap { margin-right: 0; transition: margin-right 0.3s ease; }'

new_mobile_nav = '''            .side-nav {
                position: relative;
                top: 0;
                right: 0;
                left: auto;
                width: 100%;
                height: auto;
                box-shadow: none;
                padding: 24px 18px;
                transform: translateX(0);
            }
            .page-wrap { margin-right: 0; }
'''

script_block = '''    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const navToggle = document.querySelector('.nav-toggle');
            const sideNav = document.querySelector('.side-nav');
            const pageWrap = document.querySelector('.page-wrap');
            if (navToggle && sideNav && pageWrap) {
                navToggle.addEventListener('click', function() {
                    const isOpen = sideNav.classList.toggle('open');
                    navToggle.classList.toggle('open', isOpen);
                    navToggle.setAttribute('aria-expanded', String(isOpen));
                });
                pageWrap.addEventListener('click', function(event) {
                    if (sideNav.classList.contains('open') && !event.target.closest('.side-nav') && !event.target.closest('.nav-toggle')) {
                        sideNav.classList.remove('open');
                        navToggle.classList.remove('open');
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    </script>
'''

for path in html_files:
    text = path.read_text(encoding='utf-8')
    original = text
    text = re.sub(r'(?s)        \.side-nav \{.*?\n        \}\n', new_css, text, count=1)
    text = text.replace('        .page-wrap { margin-left: 300px; transition: margin-left 0.3s ease; }', new_pagewrap)
    text = re.sub(r'(?s)            \.side-nav \{.*?\n            \}\n            \.page-wrap \{ margin-left: 0; \}', new_mobile_nav, text, count=1)
    if '<button class="nav-toggle"' not in text:
        text = re.sub(r'(</div>\s*<div class="page-wrap">)', '    </div>\n    <button class="nav-toggle" aria-expanded="false" aria-label="Toggle navigation"><i class="fas fa-bars"></i></button>\n    \1', text, count=1)
    if '.nav-toggle {' not in text and new_css in text:
        text = text.replace(new_css + '        .page-wrap {', new_css + nav_toggle_css + '        .page-wrap {')
    if 'document.querySelector(\'.nav-toggle\'' not in text:
        text = text.replace('</body>', script_block + '</body>')
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'Updated {path.name}')
    else:
        print(f'No changes for {path.name}')
