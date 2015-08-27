<div id="edititem">
    <h2>URL - add</h2>

    <img src="<%= attributes.faviconUrl %>">
    <div class="data_extend">

        <!-- expand content -->
        <div class="page_data">
            <input class="url" placeholder="url" value="<%= attributes.url %>">
            <input class="name" placeholder="name" value="<%= attributes.name %>">
            <textarea class="description" placeholder="description">
                <%= attributes.description %>
            </textarea>
        </div>

        <!-- list selection -->
        <div class="list_data">
            <select>
                <option>available lists</option>
                <% _.each(lists, function(list) { %>
                    <% if (_.indexOf(attributes.listId, list.id) !== -1) { %>
                        <option selected="selected" id="<%= list.id %>">
                    <% } else { %><option id="<%= list.id %>"><% } %>
                        <%= list.name %>
                    </option>
                <% })%>
            </select>
        </div>

    </div>

    <button class="close">close</button>
</div>
