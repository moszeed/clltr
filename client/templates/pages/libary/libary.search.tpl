<div class="results"></div>
<div class="add_new_item">

    <button>add to clltr</button>

    <div class="param content_save">
        <label>Save content to Dropbox</label>
        <input type="checkbox" checked="true">
        <span>yes, save it</span>
    </div>

    <div class="param list">

        <label>save to list</label>
        <select>
            <% _.each(lists, function(list) { %>
                <option value="<%= list.id%>"><%= list.name%></option>
            <% }) %>
        </select>
    </div>

</div>
