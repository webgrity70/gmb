import BEMHelper from 'react-bem-helper';

export const sentByMe = ({ invitedBy, myId }) => invitedBy.id === myId;
export const bem = BEMHelper({ name: 'GroupsInvites', outputIsString: true });
