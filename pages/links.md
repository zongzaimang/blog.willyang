---
layout: mypost
title: 友情链接
---

欢迎各位朋友与我建立友链，如需友链请到[留言板](chat.html)留言，我看到留言后会添加上的，本站的友链信息如下

```
名称：{{ site.title }}
描述：{{ site.description }}
地址：{{ site.domainUrl }}{{ site.baseurl }}
头像：{{ site.domainUrl }}{{ site.baseurl }}/static/img/wy-logo-blue.png
```

<ul class="friend-list">
  {%- for link in site.links %}
  <li>
    {% if link.url %}<a href="{{ link.url }}" target="_blank" rel="noopener noreferrer">{{ link.title | escape }} ↗</a>{% else %}<span>{{ link.title | escape }}</span><small>链接暂未提供</small>{% endif %}{% if link.desc %}<small>{{ link.desc | escape }}</small>{% endif %}
  </li>
  {%- endfor %}
</ul>
