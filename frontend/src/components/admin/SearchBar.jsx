export default function SearchBar({ searchBy, query, onSearchByChange, onQueryChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <select className="glass-input" value={searchBy} onChange={(event) => onSearchByChange(event.target.value)}>
        <option value="accountId">Account ID</option>
        <option value="email">User Email</option>
        <option value="aadhaar">Aadhaar Number</option>
      </select>
      <input
        className="glass-input md:col-span-2"
        placeholder={
          searchBy === 'accountId'
            ? 'Search by account id'
            : searchBy === 'email'
              ? 'Search by user email'
              : 'Search by Aadhaar number'
        }
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>
  );
}
