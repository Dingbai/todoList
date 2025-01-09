export default class SearchTool {
  constructor({ api }) {
    this.api = api // Access Editor.js API
    this.searchInput = null // To store the search input element
    this.resultsContainer = null // To display search results
    this.shortcutTriggered = false // Track if shortcut activated
    this.initShortcut() // Initialize shortcut
  }

  initShortcut() {
    // Listen for keydown events to handle Ctrl+F or Cmd+F
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault() // Prevent default browser find functionality
        this.activateSearch()
      }
    })
  }

  activateSearch() {
    if (!this.shortcutTriggered) {
      this.searchInput.focus() // Focus on the search input
      this.shortcutTriggered = true
      setTimeout(() => {
        this.shortcutTriggered = false // Reset trigger after a short delay
      }, 500)
    }
  }

  render() {
    // Create a container for the search tool
    const container = document.createElement('div')
    container.className = 'search-tool'

    // Create a search input
    this.searchInput = document.createElement('input')
    this.searchInput.type = 'text'
    this.searchInput.placeholder = 'Search content...'
    this.searchInput.className = 'search-input'
    this.searchInput.addEventListener('input', () => this.searchContent())

    // Create a container for displaying search results
    this.resultsContainer = document.createElement('div')
    this.resultsContainer.className = 'results-container'

    // Append input and results container to the main container
    container.appendChild(this.searchInput)
    container.appendChild(this.resultsContainer)

    return container
  }

  async searchContent() {
    const query = this.searchInput.value.toLowerCase()
    if (!query) {
      this.resultsContainer.innerHTML = '' // Clear results if input is empty
      return
    }

    // Get editor content
    const content = await this.api.saver.save()
    const { blocks } = content

    // Filter blocks that match the query
    const matchingBlocks = blocks.filter((block) =>
      JSON.stringify(block.data).toLowerCase().includes(query)
    )

    // Display results
    this.displayResults(matchingBlocks)
  }

  displayResults(results) {
    this.resultsContainer.innerHTML = '' // Clear previous results

    if (results.length === 0) {
      this.resultsContainer.textContent = 'No matches found'
      return
    }

    results.forEach((block, index) => {
      const resultItem = document.createElement('div')
      resultItem.className = 'result-item'
      resultItem.textContent = `Block ${index + 1}: ${JSON.stringify(block.data)}`
      this.resultsContainer.appendChild(resultItem)
    })
  }

  save() {
    return {
      query: this.searchInput?.value || ''
    }
  }
}
