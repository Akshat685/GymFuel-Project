import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNutrition } from '../features/customers/nutritionSlice';
import { fetchDietCategories } from '../features/customers/dietCategorySlice';
import { fetchDiets } from '../features/customers/dietSlice';
import { Card, Container, Row, Col, Form, Table } from 'react-bootstrap';
import GroupIcon from '@mui/icons-material/Group';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CategoryIcon from '@mui/icons-material/Category';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { fetchCustomers } from '../features/customers/customerSlice';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Dashboard = () => {
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.customers);
    const nutritionItems = useSelector((state) => state.nutrition.items);
    const dietCategories = useSelector((state) => state.dietCategories.categories);
    const diets = useSelector((state) => state.diets.diets);

    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedCustomerBMI, setSelectedCustomerBMI] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [proteinNeeds, setProteinNeeds] = useState(null);
    const [suggestedMeals, setSuggestedMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [weightGoalMeals, setWeightGoalMeals] = useState([]);

    // New state variables for weight goal
    const [weightGoal, setWeightGoal] = useState(0); // Weight goal (1 to 5 kg)
    const [goalType, setGoalType] = useState(''); // Goal type (gain or loss)

    // Fetch initial data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    dispatch(fetchNutrition()),
                    dispatch(fetchDietCategories()),
                    dispatch(fetchDiets()),
                    dispatch(fetchCustomers())
                ]);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    // Calculate meal counts
    const countMealsByCategory = () => {
        try {
            const mealCounts = {};

            if (!diets || !dietCategories) {
                console.log("Waiting for diets or categories to load");
                return {};
            }

            diets.forEach(diet => {
                const category = dietCategories.find(cat => cat._id === diet.category);
                const categoryName = category ? category.name : 'Uncategorized';
                mealCounts[categoryName] = (mealCounts[categoryName] || 0) + 1;
            });

            return mealCounts;
        } catch (error) {
            console.error("Error counting meals:", error);
            return {};
        }
    };

    // Effect to calculate BMI and protein needs when a customer is selected
    useEffect(() => {
        const selectedCustomer = customers.find(customer => customer._id === selectedCustomerId);

        if (selectedCustomer) {
            const { weight, height } = selectedCustomer;
            const heightInMeters = parseFloat(height) / 100;
            const weightNum = parseFloat(weight);

            if (!isNaN(weightNum) && !isNaN(heightInMeters) && weightNum > 0 && heightInMeters > 0) {
                const bmi = weightNum / (heightInMeters ** 2);
                setSelectedCustomerBMI(bmi.toFixed(2));
                setBmiCategory(getBmiCategory(bmi));
                const protein = weightNum * 1.6;
                setProteinNeeds(protein.toFixed(2));
                fetchSuggestedMeals(protein);
            }
        } else {
            resetStates();
        }
    }, [selectedCustomerId, customers]);

    // Fetch suggested meals based on protein needs
    const fetchSuggestedMeals = (proteinTarget) => {
        try {
            const maintenanceCategory = dietCategories.find(cat => cat.name === 'Maintenance');
            if (!maintenanceCategory) {
                console.log("Maintenance category not found");
                return;
            }
    
            const maintenanceMeals = diets.filter(diet => diet.category === maintenanceCategory._id);
            let totalProtein = 0;
            const selectedMeals = [];
            const mealOrder = ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner']; // Desired sequence with an extra Snack
            const selectedFoodItems = new Set(); // To track selected food items
    
            // Continue looping until the protein target is met
            while (totalProtein < proteinTarget) {
                // Iterate over the meal order
                for (const mealType of mealOrder) {
                    // Find meals of the current type that haven't been selected yet
                    const availableMeals = maintenanceMeals.filter(meal =>
                        meal.mealType === mealType &&
                        !selectedFoodItems.has(meal.foodItem) &&
                        totalProtein < proteinTarget
                    );
    
                    // If there are available meals of this type
                    if (availableMeals.length > 0) {
                        // Select the first available meal
                        const meal = availableMeals[0]; // Select the first available meal
                        totalProtein += parseFloat(meal.protein);
                        selectedMeals.push(meal);
                        selectedFoodItems.add(meal.foodItem); // Mark this food item as selected
                    }
                }
            }
    
            setSuggestedMeals(selectedMeals);
        } catch (error) {
            console.error("Error fetching suggested meals:", error);
            setSuggestedMeals([]);
        }
    };


  const fetchWeightGoalMeals = () => {
    try {
        const proteinNeeds = calculateProteinNeeds();
        if (!proteinNeeds) return;

        const categoryName = goalType === 'gain' ? 'Weight Gain' : 'Weight Loss';
        const category = dietCategories.find(cat => cat.name === categoryName);

        if (!category) {
            console.log(`${categoryName} category not found`);
            return;
        }

        const mealsForGoal = diets.filter(diet =>
            diet.category === category._id &&
            parseFloat(diet.protein) <= parseFloat(proteinNeeds)
        );

        let totalProtein = 0;
        const selectedMeals = [];
        const mealOrder = ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner']; // Desired sequence
        const selectedFoodItems = new Set(); // To track selected food items

        // Continue looping until the protein target is met
        while (totalProtein < proteinNeeds) {
            // Iterate over the meal order
            for (const mealType of mealOrder) {
                // Find meals of the current type that haven't been selected yet
                const availableMeals = mealsForGoal.filter(meal =>
                    meal.mealType === mealType &&
                    !selectedFoodItems.has(meal.foodItem) &&
                    totalProtein < proteinNeeds
                );

                // If there are available meals of this type
                if (availableMeals.length > 0) {
                    // Select the first available meal
                    const meal = availableMeals[0]; // Select the first available meal
                    totalProtein += parseFloat(meal.protein);
                    selectedMeals.push(meal);
                    selectedFoodItems.add(meal.foodItem); // Mark this food item as selected
                }
            }
        }

        setWeightGoalMeals(selectedMeals);
    } catch (error) {
        console.error("Error fetching meals for weight goal:", error);
        setWeightGoalMeals([]);
    }
};

    const calculateProteinNeeds = () => {
        const selectedCustomer = customers.find(customer => customer._id === selectedCustomerId);
        if (!selectedCustomer || !goalType) return null;

        const weightNum = parseFloat(selectedCustomer.weight);

        if (goalType === 'gain') {
            return (weightNum * 2.1).toFixed(2);  // Increased protein for weight gain
        } else if (goalType === 'loss') {
            return (weightNum * 1.5).toFixed(2);  // Higher protein for weight loss
        }
        return (weightNum * 2.2).toFixed(2);  // Default protein needs
    };


   

    useEffect(() => {
        if (weightGoal && goalType) {
            fetchWeightGoalMeals();
        } else {
            setWeightGoalMeals([]);
        }
    }, [weightGoal, goalType]);

    // Handle customer selection
    const handleCustomerChange = (event) => {
        setSelectedCustomerId(event.target.value);
    };

    // Get BMI category
    const getBmiCategory = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 24.9) return 'Normal weight';
        if (bmi < 29.9) return 'Overweight';
        return 'Obesity';
    };

    // Reset states function
    const resetStates = () => {
        setSelectedCustomerBMI(null);
        setBmiCategory('');
        setProteinNeeds(null);
        setSuggestedMeals([]);
    };

    // Card data for dashboard display
    const cardData = [
        {
            title: 'Customer List',
            description: `Manage your customer details effectively. (${customers.length} customers)`,
            icon: <GroupIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            background: '#E3F2FD',
        },
        {
            title: 'Nutrition',
            description: `View and edit nutrition details easily. (${nutritionItems.length} items)`,
            icon: <RestaurantIcon sx={{ fontSize: 40, color: '#388E3C' }} />,
            background: '#E8F5E9',
        },
        {
            title: 'Diet Categories',
            description: `Total Diet Categories: ${dietCategories.length}`,
            icon: <CategoryIcon sx={{ fontSize: 40, color: '#F57C00' }} />,
            background: '#FFF3E0',
        },
        {
            title: 'Diet Plans',
            description: (
                <div>
                    Diet plans according to Diet Category <br />
                    {isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        Object.entries(countMealsByCategory()).map(([category, count]) => (
                            <span key={category} className="category-count">
                                <span>{category}:</span> {count} meals<br />
                            </span>
                        ))
                    )}
                </div>
            ),
            icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#D32F2F' }} />,
            background: '#FFEBEE',
        },
    ];

    return (
        <Container>
            <div style={{ marginBottom: '16px' }}>
                <AppBar position="static" sx={{
                    background: 'linear-gradient(90deg, rgba(25, 118, 210, 1) 0%, rgba(0, 150, 136, 1) 100%)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}>
                    <Toolbar>
                        <Typography variant="h5" color="inherit" sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>
                            <i className="bi bi-house-fill me-2" /> Dashboard
                            <span className="underline"></span>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <Row className="g-4">
                {cardData.map((card, index) => (
                    <Col key={index} xs={12} sm={6} md={3}>
                        <Card className="text-center shadow-sm" style={{ backgroundColor: card.background }}>
                            <Card.Body>
                                <div className="mb-3">{card.icon}</div>
                                <Card.Title>{card.title}</Card.Title>
                                <Card.Text>{card.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

                {/* BMI Card */}
                <Col xs={12} sm={6} md={3}>
                    <Card className="text-center shadow-sm" style={{ backgroundColor: '#E3F2FD' }}>
                        <Card.Body>
                            <Card.Title>BMI</Card.Title>
                            <Form.Select className="mb-3" value={selectedCustomerId} onChange={handleCustomerChange}>
                                <option value="">Select Customer</option>
                                {customers.map(customer => (
                                    <option key={customer._id} value={customer._id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </Form.Select>

                            {selectedCustomerBMI !== null && (
                                <div>
                                    <h6>BMI: {selectedCustomerBMI}</h6>
                                    <p>Category: {bmiCategory}</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Suggested Meals Card */}
                <Col xs={12} sm={6} md={9}>
                    <Card className="text-center shadow-sm" style={{ backgroundColor: '#FFF3E0' }}>
                        <Card.Body>
                            <Card.Title>Suggested Meals</Card.Title>
                            {proteinNeeds !== null && (
                                <h6>Protein Needs: {proteinNeeds} grams</h6>
                            )}
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Meal Type</th>
                                            <th>Food Item</th>
                                            <th>Protein (g)</th>
                                        </tr>   
                                    </thead>
                                    <tbody>
                                        {suggestedMeals.length > 0 ? (
                                            suggestedMeals.map((meal, index) => (
                                                <tr key={meal._id}>
                                                    <td>{index + 1}</td>
                                                    <td className="text-capitalize">{meal.mealType}</td>
                                                    <td>{meal.foodItem}</td>
                                                    <td>{meal.protein}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">No meals available for the selected goal.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Weight Goal Card */}
                <Col xs={12} sm={6} md={3}>
                    <Card className="text-center shadow-sm" style={{ backgroundColor: '#E3F2FD' }}>
                        <Card.Body>
                            <Card.Title>Weight Goal</Card.Title>
                            <Form.Select className="mb-3" value={weightGoal} onChange={(event) => setWeightGoal(parseFloat(event.target.value))}>
                                <option value="0">Select Weight Goal</option>
                                <option value="1">1 kg</option>
                                <option value="2">2 kg</option>
                                <option value="3">3 kg</option>
                                <option value="4">4 kg</option>
                                <option value="5">5 kg</option>
                            </Form.Select>

                            <Form.Select className="mb-3" value={goalType} onChange={(event) => setGoalType(event.target.value)}>
                                <option value="">Select Goal Type</option>
                                <option value="gain">Weight Gain</option>
                                <option value="loss">Weight Loss</option>
                            </Form.Select>

                            {weightGoal > 0 && goalType && (
                                <div className="mt-3">
                                    <p>Target: {weightGoal} kg {goalType}</p>
                                    <p>Estimated Time: {Math.round(weightGoal * 7)} days</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>


                {/* Meals Based on Weight Goal Card */}
                <Col xs={12} sm={6} md={9} className="mb-3">

                    <Card className="text-center shadow-sm" style={{ backgroundColor: '#FFF3E0' }}>
                        <Card.Body>
                            <Card.Title>Meals Based on Weight Goal</Card.Title>
                            <h6>Required Daily Protein: {calculateProteinNeeds()} </h6>

                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Meal Type</th>
                                            <th>Food Item</th>
                                            <th>Protein (g)</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weightGoalMeals.length > 0 ? (
                                            weightGoalMeals.map((meal, index) => (
                                                <tr key={meal._id}>
                                                    <td>{index + 1}</td>
                                                    <td className="text-capitalize">{meal.mealType}</td>
                                                    <td>{meal.foodItem}</td>
                                                    <td>{meal.protein}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">No meals available for the selected goal.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;