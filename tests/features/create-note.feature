Feature: Create Note

    Scenario: Create a new note with an image successfully
        Given I am on the login page
        And I log in with email "wilson@gmail.com" and password "wilson"
        When I go to the "Create Note" page
        And I fill the title with "My first BDD Note"
        And I fill the content with "This is some test content from BDD"
        And I click the save button
        Then I should be redirected to the notes list
        And I should see the note "My first BDD note" in the list
