<h2 id="publications" style="margin: 2px 0px -15px;">Publications</h2>

{% assign all_pubs = site.data.publications.published | concat: site.data.publications.preprints %}
{% assign directions = "Agentic AI / LLMs|AI for Science|Efficient AI" | split: "|" %}
<div class="pub-filter" role="group" aria-label="Filter publications by research direction">
<button type="button" class="pub-filter-btn is-active" data-filter="all" aria-pressed="true">All <span class="count">{{ all_pubs.size }}</span></button>
{% for d in directions %}{% assign n = 0 %}{% for p in all_pubs %}{% if p.tags contains d %}{% assign n = n | plus: 1 %}{% endif %}{% endfor %}<button type="button" class="pub-filter-btn" data-filter="{{ d }}" aria-pressed="false">{{ d }} <span class="count">{{ n }}</span></button>
{% endfor %}</div>

<div class="publications">

{% comment %} ===== PUBLISHED ===== {% endcomment %}
<div class="pub-block">
<h3 style="margin-top: 28px; margin-bottom: 4px; font-weight: 500;">Published</h3>

{% assign published_grouped = site.data.publications.published | group_by: 'year' | sort: 'name' | reverse %}
{% for group in published_grouped %}
<div class="pub-group">
<h4 style="margin-top: 22px; margin-bottom: 6px; color: #043361; font-weight: 500; font-size: 1.17rem; letter-spacing: 0.01em;">{{ group.name }}</h4>
<ol class="bibliography">
{% for link in group.items %}{% include pub-item.html pub=link %}{% endfor %}
</ol>
</div>
{% endfor %}
</div>

{% comment %} ===== PREPRINTS ===== {% endcomment %}
<div class="pub-block">
<h3 style="margin-top: 36px; margin-bottom: 4px; font-weight: 500;">Preprints</h3>

{% assign preprints_grouped = site.data.publications.preprints | group_by: 'year' | sort: 'name' | reverse %}
{% for group in preprints_grouped %}
<div class="pub-group">
<h4 style="margin-top: 22px; margin-bottom: 6px; color: #043361; font-weight: 500; font-size: 1.17rem; letter-spacing: 0.01em;">{{ group.name }}</h4>
<ol class="bibliography">
{% for link in group.items %}{% include pub-item.html pub=link %}{% endfor %}
</ol>
</div>
{% endfor %}
</div>

</div>
