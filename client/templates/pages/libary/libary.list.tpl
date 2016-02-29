<div class="head">
    <span class="listName"><%= name %></span>
    <span class="listDescription"><%= description %></span>
    <span class="listOptions options_icon"></span>
</div>
<div class="options">

    <div class="optionsItem position">
        <span class="arrow_left"></span>
        <span class="current_position"><%= position_reversed %></span>
        <span class="arrow_right"></span>
    </div>

    <div class="optionsItem name">
        <label>list name</label>
        <input value="<%= name %>">
    </div>

    <div class="optionsItem description">
        <label>list description</label>
        <textarea><%= description %></textarea>
    </div>

    <div class="optionsItem buttons">
        <a class="remove" href="#">Remove</a>
    </div>

</div>
<div class="content"></div>
