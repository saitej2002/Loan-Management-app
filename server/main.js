import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../client/main.html';

// Subscribe to collections
Meteor.subscribe('users');
Meteor.subscribe('loans');

Template.registerForm.events({
  'click button'(event, template) {
    const email = template.find('[name=email]').value;
    const role = template.find('[name=role]').value;

    Meteor.call('users.register', email, role, (error, result) => {
      if (error) {
        console.error(error.reason);
      } else {
        console.log(`User registered with ID: ${result}`);
      }
    });
  },
});

Template.loanRequestForm.events({
  'click button'(event, template) {
    Meteor.call('loans.request', Meteor.userId(), (error, result) => {
      if (error) {
        console.error(error.reason);
      } else {
        console.log(`Loan requested with ID: ${result}`);
      }
    });
  },
});

Template.userDashboard.helpers({
  currentUser() {
    return Users.findOne(Meteor.userId());
  },

  currentUserIsAdmin() {
    const user = Users.findOne(Meteor.userId());
    return user && user.role === 'admin';
  },

  currentUserIsBorrower() {
    const user = Users.findOne(Meteor.userId());
    return user && user.role === 'borrower';
  },

  currentUserIsLender() {
    const user = Users.findOne(Meteor.userId());
    return user && user.role === 'lender';
  },

  loans() {
    return Loans.find({ userId: Meteor.userId() });
  },
});

Template.adminDashboard.helpers({
  loans() {
    return Loans.find();
  },
});

Template.userDashboard.events({
  'click button'(event, template) {
    const loanId = event.currentTarget.dataset.id;

    Meteor.call('loans.confirmPayment', loanId, (error, result) => {
      if (error) {
        console.error(error.reason);
      } else {
        console.log(`Loan payment confirmed for ID: ${result}`);
      }
    });
  },
});
