<div id="edititem">
    <h2>add/edit a Url</h2>

    <img class="faviconUrl" src="<%= attributes.faviconUrl %>">
    <div class="data_extend">

        <!-- expand content -->
        <div class="page_data">

            <div>
                <label>url</label>
                <input class="url" placeholder="url" value="<%= attributes.url %>">
            </div>

            <div>
                <label>pagename</label>
                <input class="name" placeholder="name" value="<%= attributes.name %>">
            </div>

            <div>
                <label>description</label>
                <textarea class="description" placeholder="description"><%= attributes.description %></textarea>
            </div>
        </div>

        <!-- list selection -->
        <div class="list_data">
            <label>lists</label>
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

    <div class="buttons">
        <button class="close">close</button>
    </div>
</div>
