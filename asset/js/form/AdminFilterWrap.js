/**
 * Created by dremin_s on 20.01.2017.
 */
/** @var o React */
/** @var o ReactDOM */
/** @var o is */
/** @var o $ */
"use strict";

class AdminFilterWrap extends React.Component {

	constructor(props) {
		super(props);

	}

	render() {
		return(
			<table className="adm-filter-main-table">
				<tbody>
				<tr>
					<td className="adm-filter-main-table-cell">
						<div className="adm-filter-tabs-block">
							<span className="adm-filter-tab adm-filter-tab-active">Фильтр</span>
						</div>
					</td>
				</tr>
				<tr>
					<td className="adm-filter-main-table-cell">
						<div className="adm-filter-content">
							<div className="adm-filter-content-table-wrap">
								<table cellSpacing="0" className="adm-filter-content-table" style={{"display": "table"}}>
									<tbody>
									<tr style={{"display": "table-row"}}>
										<td colSpan="3" className="delimiter">
											<div className="empty"></div>
										</td>
									</tr>

									{this.props.children}

									</tbody>
								</table>
							</div>

						</div>
					</td>
				</tr>
				</tbody>
			</table>
		)
	}
}

export default AdminFilterWrap;