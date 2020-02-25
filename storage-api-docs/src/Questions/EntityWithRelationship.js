import React, { useState } from 'react';
import { entityWithRelationship } from '../api/entity';
import { RELATIONSHIP_TYPE } from '../config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

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
		<div className="api-describe-and-demo row">
			<div className="api-describe col-md-5">
				<h3>{question.content}</h3>
				<div>
				</div>
				<b>Mô tả</b>
				<div>
					Service thống kê các thực thể có quan hệ r với thực thể đang xét. Service nhận đầu vào là <b>id</b> của
					thực thể cần xét và <b>relationship</b> - chỉ quan hệ giữa thực thể cần xét
					với các thực thể khác.
				</div>
				<hr />
				<div className="endpoint">
					<div className="api-docs-get-method-color">{apiDes.method}</div>
					<div className="api-docs-endpoint-name-text">{apiDes.endpoint}</div>
				</div>
				<hr />
				<EndpointTable details={apiDes} />
			</div>
			<div className="col-md-7">
				<h3>Demo</h3>
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
			</div>
		</div>
	);
}

export default EntityWithRelationship;
