import React, { useState } from 'react';
import { entityWithRelationship } from '../api/entity';
import { RELATIONSHIP_TYPE } from '../config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';

const DEFAULT_STATE = {
	id: '',
	relationship: RELATIONSHIP_TYPE[0],
	result: {}
}

function EntityWithRelationship({ question, apiDes }) {
	const [state, setState] = useState(DEFAULT_STATE);
	const { id, relationship, result } = state;

	const onChange = (event) => {
		const { name, value } = event.target;
		setState(state => ({ ...state, [name]: value }));
	}

	const onSubmit = (event) => {
		event.preventDefault();

		entityWithRelationship({ id, relationship })
			.then(res => {
				setState(state => ({ ...state, result: res }))
			})
			.catch((err) => {
				console.log('err', err);
			})
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<Form.Group as={Row}>
					<Form.Label column sm="3">Thực thể</Form.Label>
					<Col sm="4">
						<Form.Control
							type="text"
							name="id"
							value={id}
							onChange={onChange}
							placeholder="Node ID"
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="3">Quan hệ</Form.Label>
					<Col sm="4">
						<Form.Control as="select" name="relationship" value={relationship} onChange={onChange}>
							{
								RELATIONSHIP_TYPE.map(l =>
									<option key={l} value={l}>{l}</option>
								)
							}
						</Form.Control>
					</Col>
				</Form.Group>
				<Button variant="outline-primary" type="submit">Truy vấn</Button>
			</Form>
			<hr />
			<ReactJson src={result} />
		</>
	);
}

export default EntityWithRelationship;
