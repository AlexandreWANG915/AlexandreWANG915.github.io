<h2 id="publications" style="margin: 2px 0px -15px;">Publications</h2>

<div class="publications">

{% comment %} ===== PUBLISHED ===== {% endcomment %}
<h3 style="margin-top: 28px; margin-bottom: 4px; font-weight: 500;">Published</h3>

{% assign published_grouped = site.data.publications.published | group_by: 'year' | sort: 'name' | reverse %}
{% for group in published_grouped %}
<h4 style="margin-top: 22px; margin-bottom: 6px; color: #043361; font-weight: 500; font-size: 1.17rem; letter-spacing: 0.01em;">{{ group.name }}</h4>
<ol class="bibliography">
{% for link in group.items %}
<li>
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
    {% if link.image %}
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
    {% endif %}
    {% if link.conference_short %}
    <abbr class="badge">{{ link.conference_short }}</abbr>
    {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
      <div class="author">{{ link.authors }}</div>
      <div class="periodical"><em>{{ link.conference }}</em></div>
    <div class="links">
      {% if link.pdf %}<a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">PDF</a>{% endif %}
      {% if link.code %}<a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Code</a>{% endif %}
      {% if link.page %}<a href="{{ link.page }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Project Page</a>{% endif %}
      {% if link.bibtex %}<a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>{% endif %}
      {% if link.notes %}<strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>{% endif %}
      {% if link.others %}{{ link.others }}{% endif %}
    </div>
  </div>
</div>
</li>
<br>
{% endfor %}
</ol>
{% endfor %}

{% comment %} ===== PREPRINTS ===== {% endcomment %}
<h3 style="margin-top: 36px; margin-bottom: 4px; font-weight: 500;">Preprints</h3>

{% assign preprints_grouped = site.data.publications.preprints | group_by: 'year' | sort: 'name' | reverse %}
{% for group in preprints_grouped %}
<h4 style="margin-top: 22px; margin-bottom: 6px; color: #043361; font-weight: 500; font-size: 1.17rem; letter-spacing: 0.01em;">{{ group.name }}</h4>
<ol class="bibliography">
{% for link in group.items %}
<li>
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
    {% if link.image %}
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
    {% endif %}
    {% if link.conference_short %}
    <abbr class="badge">{{ link.conference_short }}</abbr>
    {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
      <div class="author">{{ link.authors }}</div>
      <div class="periodical"><em>{{ link.conference }}</em></div>
    <div class="links">
      {% if link.pdf %}<a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">PDF</a>{% endif %}
      {% if link.code %}<a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Code</a>{% endif %}
      {% if link.page %}<a href="{{ link.page }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Project Page</a>{% endif %}
      {% if link.bibtex %}<a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>{% endif %}
      {% if link.notes %}<strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>{% endif %}
      {% if link.others %}{{ link.others }}{% endif %}
    </div>
  </div>
</div>
</li>
<br>
{% endfor %}
</ol>
{% endfor %}

</div>
